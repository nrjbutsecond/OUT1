import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ton-platform.vn' },
    update: {},
    create: {
      email: 'admin@ton-platform.vn',
      password: adminPassword,
      name: 'TON Admin',
      phone: '0123456789',
      currentRole: 'EMPLOYEE',
      organization: 'TON Platform',
      roleAtOrg: 'Administrator',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create multiple test users
  const users = []
  const userData = [
    {
      email: 'user@ton-platform.vn',
      name: 'TON User',
      phone: '0987654321',
      currentRole: 'UNIVERSITY_STUDENT',
      organization: 'Hanoi University of Science and Technology',
      roleAtOrg: 'Event Organizer',
      role: 'USER'
    },
    {
      email: 'user@example.com',
      name: 'Test User',
      phone: '0987654321',
      currentRole: 'UNIVERSITY_STUDENT',
      organization: 'Hanoi University of Science and Technology',
      roleAtOrg: 'Event Organizer',
      role: 'USER'
    },
    {
      email: 'student@fpt.edu.vn',
      name: 'Nguyen Van A',
      phone: '0912345678',
      currentRole: 'UNIVERSITY_STUDENT',
      organization: 'FPT University',
      roleAtOrg: 'Club Member',
      role: 'USER'
    },
    {
      email: 'teacher@hust.edu.vn',
      name: 'Tran Thi B',
      phone: '0923456789',
      currentRole: 'TEACHER',
      organization: 'Hanoi University of Science and Technology',
      roleAtOrg: 'Faculty Advisor',
      role: 'USER'
    }
  ]

  for (const userInfo of userData) {
    const userPassword = await bcrypt.hash('user123', 10)
    const user = await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {},
      create: {
        ...userInfo,
        password: userPassword,
        emailVerified: new Date(),
      },
    })
    users.push(user)
    console.log('✅ Created user:', user.email)
  }

  // Create partner users
  const partners = []
  const partnerData = [
    {
      email: 'partner@ton-platform.vn',
      name: 'TON Partner',
      phone: '0934567890',
      currentRole: 'EMPLOYEE',
      organization: 'TON Platform',
      roleAtOrg: 'Partner',
      role: 'PARTNER'
    },
    {
      email: 'partner@tedxhanoi.com',
      name: 'TEDxHanoi Organizer',
      phone: '0934567890',
      currentRole: 'EMPLOYEE',
      organization: 'TEDxHanoi',
      roleAtOrg: 'Lead Organizer',
      role: 'PARTNER'
    },
    {
      email: 'partner@tedxhochiminh.com',
      name: 'TEDxHoChiMinhCity Organizer',
      phone: '0945678901',
      currentRole: 'EMPLOYEE',
      organization: 'TEDxHoChiMinhCity',
      roleAtOrg: 'Event Manager',
      role: 'PARTNER'
    },
    {
      email: 'partner@tedxdanang.com',
      name: 'TEDxDaNang Organizer',
      phone: '0956789012',
      currentRole: 'EMPLOYEE',
      organization: 'TEDxDaNang',
      roleAtOrg: 'Community Manager',
      role: 'PARTNER'
    }
  ]

  for (const partnerInfo of partnerData) {
    const partnerPassword = await bcrypt.hash('partner123', 10)
    const partner = await prisma.user.upsert({
      where: { email: partnerInfo.email },
      update: {},
      create: {
        ...partnerInfo,
        password: partnerPassword,
        emailVerified: new Date(),
      },
    })
    partners.push(partner)
    console.log('✅ Created partner:', partner.email)
  }

  // Create mentor users
  const mentors = []
  const mentorData = [
    {
      email: 'mentor@ton-platform.vn',
      name: 'TON Mentor',
      phone: '0967890123',
      currentRole: 'TEACHER',
      organization: 'TON Platform',
      roleAtOrg: 'Senior Mentor',
      role: 'MENTOR'
    },
    {
      email: 'mentor@example.com',
      name: 'Dr. John Smith',
      phone: '0967890123',
      currentRole: 'TEACHER',
      organization: 'Harvard University',
      roleAtOrg: 'Professor',
      role: 'MENTOR'
    },
    {
      email: 'mentor2@example.com',
      name: 'Sarah Johnson',
      phone: '0978901234',
      currentRole: 'EMPLOYEE',
      organization: 'Google',
      roleAtOrg: 'Senior Manager',
      role: 'MENTOR'
    }
  ]

  for (const mentorInfo of mentorData) {
    const mentorPassword = await bcrypt.hash('mentor123', 10)
    const mentor = await prisma.user.upsert({
      where: { email: mentorInfo.email },
      update: {},
      create: {
        ...mentorInfo,
        password: mentorPassword,
        emailVerified: new Date(),
      },
    })
    mentors.push(mentor)
    console.log('✅ Created mentor:', mentor.email)
  }

  // Create organizations
  const organizations = []
  const orgData = [
    {
      name: 'TON Platform',
      type: 'VIP',
      description: 'TEDx Organizer Network - Connecting and enhancing TEDx events',
      commission: 1,
      approved: true,
      createdBy: admin.id,
    },
    {
      name: 'TEDxHanoi',
      type: 'VIP',
      description: 'TEDxHanoi - Ideas worth spreading in Hanoi',
      commission: 1,
      approved: true,
      createdBy: partners[0].id,
    },
    {
      name: 'TEDxHoChiMinhCity',
      type: 'VIP',
      description: 'TEDxHoChiMinhCity - Connecting innovators in HCMC',
      commission: 1,
      approved: true,
      createdBy: partners[1].id,
    },
    {
      name: 'TEDxDaNang',
      type: 'STANDARD',
      description: 'TEDxDaNang - Ideas worth spreading in Da Nang',
      commission: 3,
      approved: true,
      createdBy: partners[2].id,
    },
    {
      name: 'TEDxCanTho',
      type: 'STANDARD',
      description: 'TEDxCanTho - TEDx community in Can Tho',
      commission: 3,
      approved: true,
      createdBy: admin.id,
    }
  ]

  for (const orgInfo of orgData) {
    const org = await prisma.organization.upsert({
      where: { name: orgInfo.name },
      update: {},
      create: orgInfo,
    })
    organizations.push(org)
    console.log('✅ Created organization:', org.name)
  }

  // Create services
  const services = []
  const serviceData = [
    {
      name: 'Event Planning Consultation',
      description: 'Professional consultation for TEDx event planning and organization',
      price: 5000000,
      category: 'optional',
      features: JSON.stringify([
        'Initial consultation meeting',
        'Event timeline planning',
        'Budget planning assistance',
        'Vendor recommendations',
        'Follow-up support'
      ]),
      organizationId: organizations[0].id, // TON Platform
    },
    {
      name: 'Speaker Training Workshop',
      description: 'Comprehensive workshop to train speakers for TEDx events',
      price: 3000000,
      category: 'onsite',
      features: JSON.stringify([
        '2-day intensive workshop',
        'Individual coaching sessions',
        'Presentation skills training',
        'Storytelling techniques',
        'Practice sessions with feedback'
      ]),
      organizationId: organizations[0].id,
    },
    {
      name: 'Technical Setup Support',
      description: 'On-site technical support for event day setup and management',
      price: 2000000,
      category: 'onsite',
      features: JSON.stringify([
        'Audio-visual equipment setup',
        'Live streaming support',
        'Technical troubleshooting',
        'Equipment rental coordination',
        'Event day technical support'
      ]),
      organizationId: organizations[0].id,
    },
    {
      name: 'Post-Event Analysis',
      description: 'Comprehensive analysis and report of event performance',
      price: 1500000,
      category: 'post_onsite',
      features: JSON.stringify([
        'Attendee feedback analysis',
        'Performance metrics report',
        'Improvement recommendations',
        'Social media impact analysis',
        'Detailed event report'
      ]),
      organizationId: organizations[0].id,
    },
    {
      name: 'Marketing Strategy Consultation',
      description: 'Strategic marketing consultation for event promotion',
      price: 4000000,
      category: 'optional',
      features: JSON.stringify([
        'Marketing strategy development',
        'Social media campaign planning',
        'Content creation guidelines',
        'Audience targeting analysis',
        'ROI tracking setup'
      ]),
      organizationId: organizations[1].id, // TEDxHanoi
    }
  ]

  for (const serviceInfo of serviceData) {
    const service = await prisma.service.create({
      data: serviceInfo,
    })
    services.push(service)
    console.log('✅ Created service:', service.name)
  }

  // Create events
  const events = []
  const eventData = [
    {
      name: 'TEDxHanoi 2024: Innovation & Technology',
      description: 'Join us for an inspiring day of talks about innovation and technology in Vietnam',
      date: new Date('2024-06-15T09:00:00Z'),
      location: 'Hanoi Opera House, 1 Trang Tien, Hoan Kiem, Hanoi',
      ticketPrice: 500000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[1].id,
    },
    {
      name: 'TEDxHoChiMinhCity 2024: Future Cities',
      description: 'Exploring the future of urban development and smart cities',
      date: new Date('2024-07-20T14:00:00Z'),
      location: 'Saigon Convention Center, 799 Nguyen Van Linh, District 7, HCMC',
      ticketPrice: 600000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[2].id,
    },
    {
      name: 'TEDxDaNang 2024: Sustainable Living',
      description: 'Discover sustainable living practices and environmental solutions',
      date: new Date('2024-08-10T10:00:00Z'),
      location: 'Da Nang University, 41 Le Duan, Hai Chau, Da Nang',
      ticketPrice: 300000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[3].id,
    },
    {
      name: 'Event Planning Workshop',
      description: 'Learn the fundamentals of organizing successful events',
      date: new Date('2024-05-25T09:00:00Z'),
      location: 'FPT University, Hoa Lac High-Tech Park, Hanoi',
      ticketPrice: 200000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Public Speaking Masterclass',
      description: 'Master the art of public speaking and presentation skills',
      date: new Date('2024-06-30T14:00:00Z'),
      location: 'HUST, 1 Dai Co Viet, Hai Ba Trung, Hanoi',
      ticketPrice: 400000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'TEDxCanTho 2024: Mekong Delta Innovation',
      description: 'Showcasing innovation and entrepreneurship in the Mekong Delta region.',
      date: new Date('2025-03-15T14:00:00Z'),
      location: 'Can Tho University, Can Tho',
      ticketPrice: 200000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[4].id,
    },
    {
      name: 'TEDxHanoi 2024: Women in Leadership',
      description: 'Celebrating women leaders and their impact on society.',
      date: new Date('2025-02-28T10:00:00Z'),
      location: 'Hanoi Opera House, Hanoi',
      ticketPrice: 400000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[1].id,
    },
    {
      name: 'TEDxHoChiMinhCity 2024: Digital Transformation',
      description: 'How digital transformation is reshaping businesses and society.',
      date: new Date('2025-04-10T09:00:00Z'),
      location: 'Landmark 81, Ho Chi Minh City',
      ticketPrice: 500000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[2].id,
    },
    {
      name: 'TEDxDaNang 2024: Creative Industries',
      description: 'Exploring the role of creativity in modern industries.',
      date: new Date('2025-05-20T15:00:00Z'),
      location: 'Da Nang Museum, Da Nang',
      ticketPrice: 300000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[3].id,
    },
    {
      name: 'Leadership Development Workshop',
      description: 'Develop essential leadership skills for the modern workplace.',
      date: new Date('2025-01-15T09:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 150000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'TEDxHanoi 2024: Climate Action',
      description: 'Addressing climate change through innovation and collective action.',
      date: new Date('2025-06-05T10:00:00Z'),
      location: 'Vietnam National University, Hanoi',
      ticketPrice: 250000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[1].id,
    },
    {
      name: 'TEDxHoChiMinhCity 2024: Startup Ecosystem',
      description: 'Building and nurturing startup ecosystems in Vietnam.',
      date: new Date('2025-07-12T14:00:00Z'),
      location: 'Saigon Innovation Hub, Ho Chi Minh City',
      ticketPrice: 400000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[2].id,
    },
    // Additional TEDx Events
    {
      name: 'TEDxYouth@Hanoi 2025',
      description: 'Empowering young voices and ideas for tomorrow.',
      date: new Date('2025-08-15T09:00:00Z'),
      location: 'Hanoi University of Science and Technology',
      ticketPrice: 100000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[1].id,
    },
    {
      name: 'TEDxWomen@HoChiMinhCity 2025',
      description: 'Celebrating women\'s achievements and inspiring change.',
      date: new Date('2025-09-20T14:00:00Z'),
      location: 'Women\'s Museum, Ho Chi Minh City',
      ticketPrice: 200000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[2].id,
    },
    {
      name: 'TEDxDaNang 2025: Smart Cities',
      description: 'Building intelligent cities for sustainable future.',
      date: new Date('2025-10-25T10:00:00Z'),
      location: 'Da Nang Smart City Center',
      ticketPrice: 300000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[3].id,
    },
    {
      name: 'TEDxCanTho 2025: Agriculture Innovation',
      description: 'Revolutionizing agriculture through technology.',
      date: new Date('2025-11-30T09:00:00Z'),
      location: 'Can Tho University of Technology',
      ticketPrice: 150000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[4].id,
    },
    {
      name: 'TEDxHanoi 2025: Education Revolution',
      description: 'Transforming education for the digital age.',
      date: new Date('2025-12-15T14:00:00Z'),
      location: 'Vietnam National University',
      ticketPrice: 250000,
      type: 'TEDX',
      approved: true,
      organizationId: organizations[1].id,
    },
    // Additional Workshops
    {
      name: 'Digital Marketing Workshop',
      description: 'Master digital marketing strategies for events.',
      date: new Date('2025-01-20T09:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 180000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Community Building Workshop',
      description: 'Learn how to build and engage communities.',
      date: new Date('2025-02-15T14:00:00Z'),
      location: 'FPT University, Hanoi',
      ticketPrice: 220000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Event Photography Workshop',
      description: 'Professional photography techniques for events.',
      date: new Date('2025-03-20T10:00:00Z'),
      location: 'Hanoi Photography Club',
      ticketPrice: 300000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Social Media Strategy Workshop',
      description: 'Create effective social media campaigns.',
      date: new Date('2025-04-25T14:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 200000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Volunteer Management Workshop',
      description: 'Effective strategies for managing event volunteers.',
      date: new Date('2025-05-30T09:00:00Z'),
      location: 'HUST, Hanoi',
      ticketPrice: 150000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Crisis Management Workshop',
      description: 'Handling unexpected situations during events.',
      date: new Date('2025-06-25T14:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 250000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Sponsorship Workshop',
      description: 'Securing and managing event sponsorships.',
      date: new Date('2025-07-30T10:00:00Z'),
      location: 'Business Incubator, Ho Chi Minh City',
      ticketPrice: 280000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Budget Planning Workshop',
      description: 'Financial planning and budget management for events.',
      date: new Date('2025-08-25T14:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 200000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Speaker Coaching Workshop',
      description: 'Advanced techniques for coaching TEDx speakers.',
      date: new Date('2025-09-30T09:00:00Z'),
      location: 'Hanoi Opera House',
      ticketPrice: 400000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Event Technology Workshop',
      description: 'Leveraging technology for better events.',
      date: new Date('2025-10-25T14:00:00Z'),
      location: 'FPT University, Ho Chi Minh City',
      ticketPrice: 320000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Content Creation Workshop',
      description: 'Creating compelling content for events.',
      date: new Date('2025-11-20T10:00:00Z'),
      location: 'Online via Zoom',
      ticketPrice: 180000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
    {
      name: 'Networking Workshop',
      description: 'Building meaningful professional networks.',
      date: new Date('2025-12-15T14:00:00Z'),
      location: 'Business Center, Da Nang',
      ticketPrice: 200000,
      type: 'WORKSHOP',
      approved: true,
      organizationId: organizations[0].id,
    },
  ]

  for (const eventInfo of eventData) {
    const event = await prisma.event.create({
      data: eventInfo,
    })
    events.push(event)
    console.log('✅ Created event:', event.name)
  }

  // Create products
  const products = []
  const productData = [
    {
      name: 'TEDx T-Shirt',
      description: 'Official TEDx branded t-shirt, comfortable cotton material',
      price: 250000,
      images: JSON.stringify(['/images/tshirt-1.jpg', '/images/tshirt-2.jpg']),
      stock: 100,
      category: 'clothing',
      organizationId: organizations[0].id,
    },
    {
      name: 'TEDx Notebook',
      description: 'Premium notebook for capturing ideas and inspiration',
      price: 150000,
      images: JSON.stringify(['/images/notebook-1.jpg']),
      stock: 200,
      category: 'stationery',
      organizationId: organizations[0].id,
    },
    {
      name: 'TEDxHanoi Mug',
      description: 'Ceramic mug with TEDxHanoi logo, perfect for coffee lovers',
      price: 180000,
      images: JSON.stringify(['/images/mug-1.jpg', '/images/mug-2.jpg']),
      stock: 50,
      category: 'accessories',
      organizationId: organizations[1].id,
    },
    {
      name: 'TEDx Cap',
      description: 'Stylish cap with TEDx branding, adjustable size',
      price: 200000,
      images: JSON.stringify(['/images/cap-1.jpg']),
      stock: 75,
      category: 'accessories',
      organizationId: organizations[0].id,
    },
    {
      name: 'TEDx Stickers Pack',
      description: 'Set of 10 TEDx branded stickers for laptops and notebooks',
      price: 50000,
      images: JSON.stringify(['/images/stickers-1.jpg']),
      stock: 300,
      category: 'accessories',
      organizationId: organizations[0].id,
    }
  ]

  for (const productInfo of productData) {
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        approved: true,
      },
    })
    products.push(product)
    console.log('✅ Created product:', product.name)
  }

  // Create some orders
  const orders = []
  for (let i = 0; i < 10; i++) {
    const order = await prisma.order.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        total: Math.floor(Math.random() * 1000000) + 100000,
        status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'][Math.floor(Math.random() * 4)],
        type: ['TICKET', 'MERCHANDISE'][Math.floor(Math.random() * 2)],
        shippingAddress: `Address ${i + 1}, District ${i + 1}, Ho Chi Minh City`,
      },
    })
    orders.push(order)
  }
  console.log('✅ Created 10 orders')

  // Create some event tickets
  const tickets = []
  for (let i = 0; i < 20; i++) {
    const ticket = await prisma.eventTicket.create({
      data: {
        eventId: events[Math.floor(Math.random() * events.length)].id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        qrCode: `QR-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        paymentStatus: ['pending', 'paid', 'cancelled'][Math.floor(Math.random() * 3)],
      },
    })
    tickets.push(ticket)
  }
  console.log('✅ Created 20 event tickets')

  // Create mentor sessions
  const mentorSessions = []
  for (let i = 0; i < 15; i++) {
    const session = await prisma.mentorSession.create({
      data: {
        mentorId: mentors[Math.floor(Math.random() * mentors.length)].id,
        studentId: users[Math.floor(Math.random() * users.length)].id,
        serviceId: services[Math.floor(Math.random() * services.length)].id,
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in next 30 days
        feedback: i % 3 === 0 ? `Great session! Very helpful guidance for event planning.` : null,
      },
    })
    mentorSessions.push(session)
  }
  console.log('✅ Created 15 mentor sessions')

  // Create organization members (unique combinations)
  const orgMembers = []
  const usedCombinations = new Set()
  
  for (let i = 0; i < 10; i++) {
    let userId, organizationId, combination
    let attempts = 0
    
    // Ensure unique combination
    do {
      userId = users[Math.floor(Math.random() * users.length)].id
      organizationId = organizations[Math.floor(Math.random() * organizations.length)].id
      combination = `${userId}-${organizationId}`
      attempts++
    } while (usedCombinations.has(combination) && attempts < 50)
    
    if (attempts >= 50) break // Avoid infinite loop
    
    usedCombinations.add(combination)
    
    try {
      const member = await prisma.organizationMember.upsert({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
        update: {},
        create: {
          userId,
          organizationId,
          role: ['member', 'admin', 'moderator'][Math.floor(Math.random() * 3)],
          approved: Math.random() > 0.2, // 80% approved
          joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
        },
      })
      orgMembers.push(member)
    } catch (error) {
      console.log(`⚠️ Skipped duplicate organization member: ${userId}-${organizationId}`)
    }
  }
  console.log(`✅ Created ${orgMembers.length} organization members`)

  // Create workspaces first (needed for service purchases)
  const workspaces = []
  for (let i = 0; i < 10; i++) {
    const workspace = await prisma.workspace.create({
      data: {
        name: `Workspace ${i + 1}`,
        type: ['SERVICE', 'ORGANIZATION'][Math.floor(Math.random() * 2)],
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        organizationId: i % 3 === 0 ? organizations[Math.floor(Math.random() * organizations.length)].id : null, // Some have organization
      },
    })
    workspaces.push(workspace)
  }
  console.log('✅ Created 10 workspaces')

  // Create service purchases
  const servicePurchases = []
  for (let i = 0; i < 15; i++) {
    const purchase = await prisma.servicePurchase.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        serviceId: services[Math.floor(Math.random() * services.length)].id,
        status: ['active', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        workspaceId: i % 3 === 0 ? workspaces[Math.floor(Math.random() * workspaces.length)].id : null, // Some have workspace
        purchasedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in past 90 days
      },
    })
    servicePurchases.push(purchase)
  }
  console.log('✅ Created 15 service purchases')

  // Create cart items (unique combinations)
  const cartItems = []
  const usedCartCombinations = new Set()
  
  for (let i = 0; i < 15; i++) {
    let userId, productId, combination
    let attempts = 0
    
    // Ensure unique combination
    do {
      userId = users[Math.floor(Math.random() * users.length)].id
      productId = products[Math.floor(Math.random() * products.length)].id
      combination = `${userId}-${productId}`
      attempts++
    } while (usedCartCombinations.has(combination) && attempts < 50)
    
    if (attempts >= 50) break // Avoid infinite loop
    
    usedCartCombinations.add(combination)
    
    try {
      const cartItem = await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        update: {},
        create: {
          userId,
          productId,
          quantity: Math.floor(Math.random() * 5) + 1,
          addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past week
        },
      })
      cartItems.push(cartItem)
    } catch (error) {
      console.log(`⚠️ Skipped duplicate cart item: ${userId}-${productId}`)
    }
  }
  console.log(`✅ Created ${cartItems.length} cart items`)

  // Create order items
  const orderItems = []
  for (let i = 0; i < 30; i++) {
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: orders[Math.floor(Math.random() * orders.length)].id,
        productId: products[Math.floor(Math.random() * products.length)].id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 500000) + 50000,
      },
    })
    orderItems.push(orderItem)
  }
  console.log('✅ Created 30 order items')


  // Create workspace pages
  const workspacePages: { id: string }[] = []
  for (let i = 0; i < 20; i++) {
    const page = await prisma.workspacePage.create({
      data: {
        workspaceId: workspaces[Math.floor(Math.random() * workspaces.length)].id,
        title: `Page ${i + 1}`,
        content: `This is the content for page ${i + 1}. It contains important information about the project.`,
        order: i,
        parentId: i % 5 === 0 ? workspacePages[Math.floor(Math.random() * workspacePages.length)]?.id : null, // Some have parent
      },
    })
    workspacePages.push(page)
  }
  console.log('✅ Created 20 workspace pages')

  // Create workspace tasks
  const workspaceTasks = []
  for (let i = 0; i < 25; i++) {
    const task = await prisma.workspaceTask.create({
      data: {
        workspaceId: workspaces[Math.floor(Math.random() * workspaces.length)].id,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        status: ['TODO', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)],
        assigneeId: users[Math.floor(Math.random() * users.length)].id,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in next 30 days
      },
    })
    workspaceTasks.push(task)
  }
  console.log('✅ Created 25 workspace tasks')

  // Create workspace files
  const workspaceFiles = []
  for (let i = 0; i < 15; i++) {
    const file = await prisma.workspaceFile.create({
      data: {
        workspaceId: workspaces[Math.floor(Math.random() * workspaces.length)].id,
        name: `file-${i + 1}.pdf`,
        url: `/uploads/workspace-${i + 1}/file-${i + 1}.pdf`,
        size: Math.floor(Math.random() * 10000000) + 100000, // Random size between 100KB and 10MB
        uploadedBy: users[Math.floor(Math.random() * users.length)].id,
      },
    })
    workspaceFiles.push(file)
  }
  console.log('✅ Created 15 workspace files')

  // Create mentor schedules
  const mentorSchedules = []
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in next 30 days
    const schedule = await prisma.mentorSchedule.create({
      data: {
        mentorId: mentors[Math.floor(Math.random() * mentors.length)].id,
        date: startDate,
        startTime: "09:00", // Simple time format
        endTime: "17:00", // Simple time format
        available: Math.random() > 0.3, // 70% available
      },
    })
    mentorSchedules.push(schedule)
  }
  console.log('✅ Created 20 mentor schedules')

  // Create learning progress (unique combinations)
  const learningProgress = []
  const usedLearningCombinations = new Set()
  
  for (let i = 0; i < 30; i++) {
    let userId, serviceId, combination
    let attempts = 0
    
    // Ensure unique combination
    do {
      userId = users[Math.floor(Math.random() * users.length)].id
      serviceId = services[Math.floor(Math.random() * services.length)].id
      combination = `${userId}-${serviceId}`
      attempts++
    } while (usedLearningCombinations.has(combination) && attempts < 50)
    
    if (attempts >= 50) break // Avoid infinite loop
    
    usedLearningCombinations.add(combination)
    
    try {
      const progress = await prisma.learningProgress.upsert({
        where: {
          userId_serviceId: {
            userId,
            serviceId,
          },
        },
        update: {},
        create: {
          userId,
          serviceId,
          completionPercent: Math.floor(Math.random() * 100), // 0-100%
          materials: JSON.stringify([`Material ${i + 1}`, `Resource ${i + 1}`]),
          lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past week
        },
      })
      learningProgress.push(progress)
    } catch (error) {
      console.log(`⚠️ Skipped duplicate learning progress: ${userId}-${serviceId}`)
    }
  }
  console.log(`✅ Created ${learningProgress.length} learning progress records`)

  // Create page views
  const pageViews = []
  for (let i = 0; i < 100; i++) {
    const pageView = await prisma.pageView.create({
      data: {
        userId: Math.random() > 0.2 ? users[Math.floor(Math.random() * users.length)].id : null, // 80% have user
        page: ['/services', '/events', '/merchandise', '/partners', '/tedx-vietnam'][Math.floor(Math.random() * 5)],
        organizationId: Math.random() > 0.5 ? organizations[Math.floor(Math.random() * organizations.length)].id : null, // 50% have organization
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in past 30 days
      },
    })
    pageViews.push(pageView)
  }
  console.log('✅ Created 100 page views')

  // Create notifications
  const notifications = []
  for (let i = 0; i < 50; i++) {
    const notification = await prisma.notification.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        title: `Notification ${i + 1}`,
        content: `This is notification content ${i + 1}. Important information for the user.`,
        type: ['ORDER', 'EVENT', 'ORGANIZATION', 'SYSTEM', 'MENTOR'][Math.floor(Math.random() * 5)],
        read: Math.random() > 0.3, // 70% read
        relatedId: Math.random() > 0.5 ? `related-${i + 1}` : null,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past week
      },
    })
    notifications.push(notification)
  }
  console.log('✅ Created 50 notifications')

  // Create calendar events
  const calendarEvents = []
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000) // Random date in next 60 days
    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        title: `Calendar Event ${i + 1}`,
        date: startDate,
        endDate: Math.random() > 0.5 ? new Date(startDate.getTime() + 2 * 60 * 60 * 1000) : null, // 2 hours later
        type: ['EVENT', 'DEADLINE', 'SESSION', 'MEETING', 'REMINDER'][Math.floor(Math.random() * 5)],
        relatedId: Math.random() > 0.5 ? `related-${i + 1}` : null,
        notes: i % 3 === 0 ? `Notes for calendar event ${i + 1}` : null,
      },
    })
    calendarEvents.push(calendarEvent)
  }
  console.log('✅ Created 20 calendar events')

  // Create discount codes
  const discountCodes = []
  const discountData = [
    {
      code: 'WELCOME10',
      description: 'Welcome discount for new users',
      type: 'PERCENTAGE',
      value: 10,
      minAmount: 100000,
      maxUses: 100,
      validUntil: new Date('2025-12-31'),
    },
    {
      code: 'TEDX20',
      description: 'Special discount for TEDx events',
      type: 'PERCENTAGE',
      value: 20,
      minAmount: 200000,
      maxUses: 50,
      validUntil: new Date('2025-06-30'),
    },
    {
      code: 'STUDENT50',
      description: 'Student discount',
      type: 'PERCENTAGE',
      value: 50,
      minAmount: 50000,
      maxUses: 200,
      validUntil: new Date('2025-12-31'),
    },
    {
      code: 'SAVE100K',
      description: 'Fixed amount discount',
      type: 'FIXED_AMOUNT',
      value: 100000,
      minAmount: 500000,
      maxUses: 30,
      validUntil: new Date('2025-03-31'),
    },
    {
      code: 'EARLYBIRD',
      description: 'Early bird discount',
      type: 'PERCENTAGE',
      value: 15,
      minAmount: 150000,
      maxUses: 75,
      validUntil: new Date('2025-02-28'),
    },
  ]

  for (const discountInfo of discountData) {
    const discountCode = await prisma.discountCode.create({
      data: discountInfo,
    })
    discountCodes.push(discountCode)
    console.log('✅ Created discount code:', discountCode.code)
  }

  console.log('🎉 Comprehensive seed completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${users.length + partners.length + mentors.length + 1} users (1 admin, ${users.length} users, ${partners.length} partners, ${mentors.length} mentors)`)
  console.log(`   - ${organizations.length} organizations`)
  console.log(`   - ${services.length} services`)
  console.log(`   - ${events.length} events`)
  console.log(`   - ${products.length} products`)
  console.log(`   - ${orders.length} orders`)
  console.log(`   - ${tickets.length} event tickets`)
  console.log(`   - ${mentorSessions.length} mentor sessions`)
  console.log(`   - ${orgMembers.length} organization members`)
  console.log(`   - ${servicePurchases.length} service purchases`)
  console.log(`   - ${cartItems.length} cart items`)
  console.log(`   - ${orderItems.length} order items`)
  console.log(`   - ${workspaces.length} workspaces`)
  console.log(`   - ${workspacePages.length} workspace pages`)
  console.log(`   - ${workspaceTasks.length} workspace tasks`)
  console.log(`   - ${workspaceFiles.length} workspace files`)
  console.log(`   - ${mentorSchedules.length} mentor schedules`)
  console.log(`   - ${learningProgress.length} learning progress records`)
  console.log(`   - ${pageViews.length} page views`)
  console.log(`   - ${notifications.length} notifications`)
  console.log(`   - ${calendarEvents.length} calendar events`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })